import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";
import { InvoiceModel } from "../repository/sequelize/invoice.model";
import { InvoiceItemModel } from "../repository/sequelize/invoice-item.model";

const generateInput: GenerateInvoiceFacadeInputDto = {
	name: "John Doe",
	document: "12345678900",
	street: "Rua dos Bobos",
	number: "0",
	complement: "Casa",
	city: "São Paulo",
	state: "SP",
	zipCode: "12345678",
	items: [
		{
			id: "1",
			name: "Product 1",
			price: 10
		},
		{
			id: "2",
			name: "Product 2",
			price: 20
		}
	]
}

describe("Invoice Facade unit test", () => {

	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
			sync: { force: true },
		});

		await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
		await sequelize.sync();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it("should generate an invoice", async () => {
		const facade = InvoiceFacadeFactory.create();
		const output = await facade.generate(generateInput);

		expect(output).toHaveProperty("id");
		expect(output).toHaveProperty("total");
		expect(output.total).toBe(30);
		expect(output.name).toBe(generateInput.name);
		expect(output.document).toBe(generateInput.document);
		expect(output.street).toBe(generateInput.street);
		expect(output.number).toBe(generateInput.number);
		expect(output.complement).toBe(generateInput.complement);
		expect(output.city).toBe(generateInput.city);
		expect(output.state).toBe(generateInput.state);
		expect(output.zipCode).toBe(generateInput.zipCode);
		expect(output.items).toHaveLength(2);
		expect(output.items[0].id).toBe(generateInput.items[0].id);
		expect(output.items[0].name).toBe(generateInput.items[0].name);
		expect(output.items[0].price).toBe(generateInput.items[0].price);
		expect(output.items[1].id).toBe(generateInput.items[1].id);
		expect(output.items[1].name).toBe(generateInput.items[1].name);
		expect(output.items[1].price).toBe(generateInput.items[1].price);
	});

	it("should find an invoice", async () => {
		const facade = InvoiceFacadeFactory.create();
		const output = await facade.generate(generateInput);
		const findOutput = await facade.find({ id: output.id });

		expect(findOutput).toHaveProperty("id");
		expect(findOutput).toHaveProperty("createdAt");
		expect(findOutput).toHaveProperty("total");
		expect(findOutput.total).toBe(30);
		expect(findOutput.name).toBe(generateInput.name);
		expect(findOutput.document).toBe(generateInput.document);
		expect(findOutput.address.street).toBe(generateInput.street);
		expect(findOutput.address.number).toBe(generateInput.number);
		expect(findOutput.address.complement).toBe(generateInput.complement);
		expect(findOutput.address.city).toBe(generateInput.city);
		expect(findOutput.address.state).toBe(generateInput.state);
		expect(findOutput.address.zipCode).toBe(generateInput.zipCode);
		expect(findOutput.items).toHaveLength(2);
		expect(findOutput.items[0].id).toBe(generateInput.items[0].id);
		expect(findOutput.items[0].name).toBe(generateInput.items[0].name);
		expect(findOutput.items[0].price).toBe(generateInput.items[0].price);
		expect(findOutput.items[1].id).toBe(generateInput.items[1].id);
		expect(findOutput.items[1].name).toBe(generateInput.items[1].name);
		expect(findOutput.items[1].price).toBe(generateInput.items[1].price);
	});
});