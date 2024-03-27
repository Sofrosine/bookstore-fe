interface Order {
  id: string;
  user_id: string;
  book_id: string;
  book: Book;
  created_at: string;
}
