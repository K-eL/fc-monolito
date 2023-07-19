import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";


const invoiceInput: GenerateInvoiceUseCaseInputDto = {
	name: "John Doe",
	document: "12345678900",
	items: [
		{
			id: "1",
			name: "Product 1",
			price: 100,
		},
		{
			id: "2",
			name: "Product 2",
			price: 150,
		},
	],
	street: "Rua dos Does",
	number: "0",
	complement: "",
	city: "São Paulo",
	state: "SP",
	zipCode: "12345678",
};

const MockRepository = () => {
	return {
		generate: jest.fn(),
		find: jest.fn(),
	}
};

describe("Generate invoice usecase unit test", () => {
	it("should generate an invoice", async () => {
		const invoiceRepository = MockRepository();
		const usecase = new GenerateInvoiceUseCase(invoiceRepository);

		const result = await usecase.execute(invoiceInput);

		expect(result.id).toBeDefined();
		expect(result.name).toBe(invoiceInput.name);
		expect(result.document).toBe(invoiceInput.document);
		expect(result.items).toBe(invoiceInput.items);
		expect(result.street).toBe(invoiceInput.street);
		expect(result.number).toBe(invoiceInput.number);
		expect(result.complement).toBe(invoiceInput.complement);
		expect(result.city).toBe(invoiceInput.city);
		expect(result.state).toBe(invoiceInput.state);
		expect(result.zipCode).toBe(invoiceInput.zipCode);
		expect(result.total).toBe(250);
		expect(invoiceRepository.generate).toHaveBeenCalled();
	});
});