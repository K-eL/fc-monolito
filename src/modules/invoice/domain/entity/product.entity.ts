import Id from "../../../@shared/domain/value-object/id.value-object";

interface ProductProps {
	id: Id
	name: string
	price: number
}

export default class Product {

	private _id: Id
	private _name: string
	private _price: number

	constructor(props: ProductProps) {
		this._id = props.id
		this._name = props.name
		this._price = props.price
	}

	get id(): Id {
		return this._id
	}

	get name(): string {
		return this._name
	}

	get price(): number {
		return this._price
	}
}