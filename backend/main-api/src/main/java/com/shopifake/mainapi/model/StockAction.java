package com.shopifake.mainapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "stock_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "variant_id", nullable = false)
    private Long variantId;

    @Column(nullable = false, length = 100)
    private String sku;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false, length = 10)
    private ActionType actionType;

    @Column(nullable = false)
    private Integer quantity;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}

