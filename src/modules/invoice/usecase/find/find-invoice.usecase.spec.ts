import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-object/address.value-object";
import FindInvoiceUseCase from "./find-invoice.usecase";

const output: Invoice = new Invoice({
	id: new Id("1"),
	name: "John Doe",
	document: "12345678900",
	address: new Address({
		street: "Rua dos Does",
		number: "0",
		complement: "",
		city: "São Paulo",
		state: "SP",
		zipCode: "12345678"
	}),
	items: [
		new Product(
			{
				id: new Id("1"),
				name: "Product 1",
				price: 100,
			}),
		new Product({
			id: new Id("2"),
			name: "Product 2",
			price: 150,
		}),
	],
	createdAt: new Date(),
	updatedAt: new Date()
})

const MockRepository = () => {
	return {
		find: jest.fn().mockReturnValue(Promise.resolve(output)),
		generate: jest.fn(),
	}
};

describe("Find invoice usecase unit test", () => {
	it("should find an invoice", async () => {
		const invoiceRepository = MockRepository();
		const usecase = new FindInvoiceUseCase(invoiceRepository);

		const result = await usecase.execute({ id: "1" });

		expect(result.id).toBe(output.id.id);
		expect(result.name).toBe(output.name);
		expect(result.document).toBe(output.document);
		expect(result.items.length).toBe(2);
		expect(result.items[0].id).toBe(output.items[0].id.id);
		expect(result.items[0].name).toBe(output.items[0].name);
		expect(result.items[0].price).toBe(output.items[0].price);
		expect(result.items[1].id).toBe(output.items[1].id.id);
		expect(result.items[1].name).toBe(output.items[1].name);
		expect(result.items[1].price).toBe(output.items[1].price);
		expect(result.address.street).toBe(output.address.street);
		expect(result.address.number).toBe(output.address.number);
		expect(result.address.complement).toBe(output.address.complement);
		expect(result.address.city).toBe(output.address.city);
		expect(result.address.state).toBe(output.address.state);
		expect(result.address.zipCode).toBe(output.address.zipCode);
		expect(result.total).toBe(output.total);
		expect(result.createdAt).toBe(output.createdAt);
		expect(invoiceRepository.find).toHaveBeenCalled();
	});

});

