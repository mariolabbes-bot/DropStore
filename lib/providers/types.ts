export interface ProductData {
    externalId: string;
    title: string;
    price: number; // Precio en centavos (integer)
    description: string;
    images: string[];
    vendor: string;
    url: string;
    variants?: any[];
}

export interface DropshippingProvider {
    name: string;

    /**
     * Busca productos en el proveedor externo
     */
    searchProducts(query: string): Promise<ProductData[]>;

    /**
     * Obtiene detalles completos de un producto específico
     */
    getProductDetails(externalId: string): Promise<ProductData>;

    /**
     * (Opcional) Verifica si un producto sigue disponible/válido
     */
    // validateProduct(url: string): Promise<boolean>;

    /**
     * Envía una orden al proveedor
     * @returns ID de la orden en el sistema del proveedor
     */
    placeOrder(orderDetails: any): Promise<string>;
}
