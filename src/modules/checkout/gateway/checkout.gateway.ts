import Order from "../domain/entity/order.entity";

export default interface CheckoutGateway {
	addOrder(order: Order): Promise<void>;
	findOrder(id: string): Promise<Order | null>;
}