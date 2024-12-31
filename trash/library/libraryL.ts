import type { BookDataList, BookRawData } from "./types";
import { sampleData } from "./sampleData";

class Library {
	#data: Map<number, Book>;
	#start: Book;
	#end: Book;
	constructor(data: BookDataList) {
		this.#data = new Map();
		this.createBooks(data);
	}
	createBooks(data: BookDataList) {
		for (const dat of data) {
			this.addBook(dat);
		}
	}
	accessBook(id: number): Book {
		if (!this.hasBook(id)) throw new Error(`Book: ${id} does not  exist`);
		const book = this.#data.get(id);
		this.#insertAtEnd(book);
		return book;
	}
	addBook(data: BookRawData, del: boolean = false) {
		const nBook = new Book(...data);
		this.#setBook(nBook.id, nBook);
		this.#prepend(nBook);

		if (del && this.#start.next) {
			this.#deleteBook(this.#start.next.id);
			this.#slice(this.#start.next);
		}
	}
	clearLibrary() {
		this.#data.clear();
		this.#start = undefined;
	}

	//Map interaction
	hasBook(id: number) {
		return this.#data.has(id);
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
	//linked list manipulation
	#insertAtEnd(book: Book) {
		this.#slice(book);
		[book.prev, this.#end.next] = [this.#end, book];
		this.#end = book;
	}
	#prepend(book: Book) {
		if (!this.#start) {
			this.#start = book;
			this.#end = book;
		} else {
			[book.next, this.#start.prev] = [this.#start, book];
			this.#start = book;
		}
	}
	#slice(book: Book) {
		if (this.#start === book) {
			if (book.next) {
				book.next.prev = null;
				this.#start = book.next;
			} else {
				this.#start = null;
			}
		} else if (!book.next) {
			book.prev.next = null;
		} else {
			[book.prev.next, book.next.prev] = [book.next, book.prev];
		}
		[book.prev, book.next] = [null, null];
	}
	toJson() {
		return this.#start.toJSON();
	}
}

class Book {
	#id: number;
	#prev: Book;
	#next: Book;
	constructor(id: number) {
		this.#id = id;
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

	get id() {
		return this.#id;
	}
	get sid() {
		return this.#id.toString().padStart(2, " ");
	}
	toJSON() {
		console.log(this.me());
		if (!this.#next) return;
		this.#next.toJSON();
	}
	me() {
		let str = this.#prev ? " " : `prev: ${-1}`;
		str + ` me: ${this.sid}`;
		if (this.#next) str += this.#next.me();
		else str += ` next: ${-1}`;
		return str;
	}
}

//Startup Tests and clear
export const BookLibrary = new Library(sampleData.init);
console.log("after init");
BookLibrary.toJson();
[40, 3, 2, 0].forEach((num) => BookLibrary.accessBook(num));
console.log("after change:");
BookLibrary.toJson();
BookLibrary.clearLibrary();
