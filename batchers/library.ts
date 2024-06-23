type BookDataList = BookRawData[];
type BookRawData = [number, number?];

export class Library {
	#data: Map<number, Book>;
	#least: Book;
	constructor(data: BookDataList) {
		this.#data = new Map();
		this.createBooks(data);
	}
	createBooks(data: BookDataList) {
		for (const [id, count] of data) {
			const nBook = new Book(id, count);
			this.#setBook(nBook.id, nBook);
			if (!this.#least) this.#least = nBook;
			else {
				const found = this.#least.findBook(nBook.count);
				this.#insert(nBook, found);
			}
		}
	}
	accessBook(id: number): Book | undefined {
		if (!this.hasBook(id)) return undefined;
		const book = this.#data.get(id);
		book.count = ++book.count;
		if (book.count > book.next.count) {
			if (this.#least === book) this.#least = book.next;
			const found = book.findBook(book.count);
			this.#insert(book, found);
		}
		return book;
	}
	hasBook(id: number) {
		return this.#data.has(id);
	}
	addBook(data: BookRawData, del: boolean = false) {
		const nBook = new Book(...data);
		this.#setBook(nBook.id, nBook);

		const found = this.#least.findBook(nBook.count);
		this.#insert(nBook, found);

		if (del) {
			const toDelete = this.#least === nBook ? nBook.next : this.#least;
			this.#deleteBook(toDelete.id);
			this.#slice(toDelete);
		}
	}
	#slice(book: Book) {
		if (this.#least === book) {
			this.#least = book.next;
			book.next.prev = null;
		} else if (!book.next) {
			book.prev.next = null;
		} else {
			[book.prev.next, book.next.prev] = [book.next, book.prev];
		}
	}
	#setBook(id: number, book: Book) {
		if (this.hasBook(id)) throw new Error(`Book:${id} was already set`);
		this.#data.set(id, book);
	}
	#deleteBook(id: number) {
		if (!this.hasBook(id))
			throw new Error(`Tried to delete non existend Book. id:${id}`);
		this.#data.delete(id);
	}
	#insert(bookA: Book, bookB: Book) {
		if (bookB.count >= bookA.count) {
			[bookA.next, bookA.prev, bookB.prev] = [bookB, bookB.prev, bookA];
			if (bookB === this.#least) {
				this.#least = bookA;
			}
		} else {
			[bookA.prev, bookB.next] = [bookB, bookA];
		}
	}
}

class Book {
	#id: number;
	#count: number;
	#prev: Book;
	#next: Book;
	constructor(id: number, count: number = 0) {
		this.#id = id;
		this.#count = count;
	}
	findBook(toTop: number): Book {
		if (this.count >= toTop) return this;
		return this.#next?.findBook(toTop) ?? this;
	}
	get prev() {
		return this.#prev;
	}
	set prev(prev: Book) {
		this.#prev = prev;
	}

	get next() {
		return this.#next;
	}
	set next(next: Book) {
		this.#next = next;
	}

	get count() {
		return this.#count;
	}
	set count(count) {
		this.#count = count;
	}

	get id() {
		return this.#id;
	}
}

const sampleData = {
	init: [
		[0, 100],
		[1, 10],
		[2, 30],
		[40, 22],
		[3, 0],
	],
	extend: [
		[4, 50],
		[5, 100],
		[6, 0],
		[7, 88],
	],
	errors: {
		add: 0,
		del: 999,
	},
};
