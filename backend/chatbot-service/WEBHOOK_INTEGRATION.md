# Guide d'intégration Webhook

## 🔔 Comment intégrer le chatbot-service avec vos microservices

Le chatbot-service expose des endpoints webhook pour recevoir automatiquement les notifications de création, modification ou suppression de produits.

## 📡 Endpoints Webhook

### 1. Créer ou Mettre à jour un produit

**Endpoint:** `POST /webhook/product`

**Quand l'utiliser:**
- Après la création d'un nouveau produit
- Après la modification d'un produit existant

**Body:**
```json
{
  "event": "created",
  "product": {
    "id": 1,
    "name": "Nike Air Max 90",
    "description": "Baskets Nike Air Max 90 iconiques...",
    "price": 139.99,
    "category": "Baskets",
    "color": "Blanc et Rouge",
    "style": "Sportif",
    "stock": 25,
    "brand": "Nike"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "productId": 1,
  "productName": "Nike Air Max 90"
}
```

### 2. Supprimer un produit

**Endpoint:** `DELETE /webhook/product/:id`

**Quand l'utiliser:**
- Après la suppression d'un produit

**Exemple:** `DELETE /webhook/product/1`

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "productId": 1
}
```

## 🔧 Intégration dans vos microservices

### Option 1: Appel HTTP direct (Java/Spring Boot)

```java
// ProductService.java
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Service
public class ProductService {
    
    private final RestTemplate restTemplate;
    private final String chatbotServiceUrl = "http://chatbot-service:3000";
    
    public ProductService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    public Product createProduct(Product product) {
        // 1. Sauvegarder le produit dans votre base de données
        Product savedProduct = productRepository.save(product);
        
        // 2. Notifier le chatbot-service
        notifyChatbotService("created", savedProduct);
        
        return savedProduct;
    }
    
    public Product updateProduct(Long id, Product product) {
        // 1. Mettre à jour le produit
        Product updatedProduct = productRepository.save(product);
        
        // 2. Notifier le chatbot-service
        notifyChatbotService("updated", updatedProduct);
        
        return updatedProduct;
    }
    
    public void deleteProduct(Long id) {
        // 1. Supprimer le produit
        productRepository.deleteById(id);
        
        // 2. Notifier le chatbot-service
        notifyChatbotServiceDelete(id);
    }
    
    private void notifyChatbotService(String event, Product product) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> payload = new HashMap<>();
            payload.put("event", event);
            payload.put("product", product);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            
            restTemplate.postForEntity(
                chatbotServiceUrl + "/webhook/product",
                request,
                String.class
            );
            
            System.out.println("✅ Chatbot notifié: " + event + " - " + product.getName());
        } catch (Exception e) {
            // Ne pas bloquer si le chatbot-service est indisponible
            System.err.println("⚠️ Impossible de notifier le chatbot-service: " + e.getMessage());
        }
    }
    
    private void notifyChatbotServiceDelete(Long productId) {
        try {
            restTemplate.delete(chatbotServiceUrl + "/webhook/product/" + productId);
            System.out.println("✅ Chatbot notifié: deletion - ID " + productId);
        } catch (Exception e) {
            System.err.println("⚠️ Impossible de notifier le chatbot-service: " + e.getMessage());
        }
    }
}
```

### Option 2: Avec événements asynchrones (Spring Events)

```java
// ProductEventPublisher.java
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class ProductEventPublisher {
    
    private final ApplicationEventPublisher eventPublisher;
    
    public ProductEventPublisher(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }
    
    public void publishProductCreated(Product product) {
        eventPublisher.publishEvent(new ProductCreatedEvent(this, product));
    }
    
    public void publishProductUpdated(Product product) {
        eventPublisher.publishEvent(new ProductUpdatedEvent(this, product));
    }
    
    public void publishProductDeleted(Long productId) {
        eventPublisher.publishEvent(new ProductDeletedEvent(this, productId));
    }
}

// ChatbotWebhookListener.java
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class ChatbotWebhookListener {
    
    private final RestTemplate restTemplate;
    private final String chatbotServiceUrl = "http://chatbot-service:3000";
    
    @Async
    @EventListener
    public void handleProductCreated(ProductCreatedEvent event) {
        notifyChatbot("created", event.getProduct());
    }
    
    @Async
    @EventListener
    public void handleProductUpdated(ProductUpdatedEvent event) {
        notifyChatbot("updated", event.getProduct());
    }
    
    @Async
    @EventListener
    public void handleProductDeleted(ProductDeletedEvent event) {
        try {
            restTemplate.delete(chatbotServiceUrl + "/webhook/product/" + event.getProductId());
        } catch (Exception e) {
            // Log l'erreur mais ne pas bloquer
        }
    }
    
    private void notifyChatbot(String event, Product product) {
        // Même code que Option 1
    }
}
```

### Option 3: Avec message broker (RabbitMQ/Kafka) - Recommandé pour la production

```java
// Configuration RabbitMQ
@Configuration
public class RabbitMQConfig {
    @Bean
    public Queue productQueue() {
        return new Queue("product.events", true);
    }
    
    @Bean
    public TopicExchange productExchange() {
        return new TopicExchange("product.exchange");
    }
    
    @Bean
    public Binding binding() {
        return BindingBuilder
            .bind(productQueue())
            .to(productExchange())
            .with("product.*");
    }
}

// Producer dans le service produit
@Service
public class ProductEventProducer {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void sendProductEvent(String event, Product product) {
        Map<String, Object> message = new HashMap<>();
        message.put("event", event);
        message.put("product", product);
        
        rabbitTemplate.convertAndSend(
            "product.exchange",
            "product." + event,
            message
        );
    }
}

// Consumer dans un microservice dédié ou dans le chatbot-service
@Component
public class ProductEventConsumer {
    
    @RabbitListener(queues = "product.events")
    public void handleProductEvent(Map<String, Object> message) {
        String event = (String) message.get("event");
        Product product = (Product) message.get("product");
        
        // Appeler le webhook du chatbot-service
        notifyChatbotService(event, product);
    }
}
```

## 🧪 Tester les webhooks

### Test avec cURL

```bash
# Créer un produit
curl -X POST http://localhost:3000/webhook/product \
  -H "Content-Type: application/json" \
  -d '{
    "event": "created",
    "product": {
      "id": 100,
      "name": "Test Product",
      "description": "Description du produit test",
      "price": 99.99,
      "category": "Test",
      "stock": 10
    }
  }'

# Supprimer un produit
curl -X DELETE http://localhost:3000/webhook/product/100
```

### Test avec PowerShell

```powershell
# Créer un produit
$product = @{
    event = "created"
    product = @{
        id = 100
        name = "Test Product"
        description = "Description du produit test"
        price = 99.99
        category = "Test"
        stock = 10
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/webhook/product -Method POST -ContentType "application/json" -Body $product

# Supprimer un produit
Invoke-RestMethod -Uri http://localhost:3000/webhook/product/100 -Method DELETE
```

## 📋 Bonnes pratiques

1. **Asynchrone:** Utilisez des appels asynchrones pour ne pas bloquer votre service principal
2. **Retry Logic:** Implémentez une logique de retry en cas d'échec
3. **Circuit Breaker:** Utilisez un circuit breaker pour éviter la cascade de pannes
4. **Idempotence:** Les webhooks doivent être idempotents (même appel plusieurs fois = même résultat)
5. **Logging:** Loggez tous les appels webhook pour le debugging
6. **Monitoring:** Surveillez les taux de succès/échec des webhooks

## 🔒 Sécurité (optionnel pour la production)

Pour sécuriser vos webhooks, vous pouvez ajouter:

1. **API Key:** Dans les headers
2. **HMAC Signature:** Pour vérifier l'authenticité
3. **IP Whitelisting:** Autoriser uniquement certaines IPs
4. **Rate Limiting:** Limiter le nombre de requêtes

Exemple avec API Key:

```javascript
// Dans chatbot-service
app.post('/webhook/product', (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.WEBHOOK_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}, async (req, res) => {
    // ... reste du code
});
```
