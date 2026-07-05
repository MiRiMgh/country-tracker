
export const metadata = {
  title: "Мой паспорт мира",
  description: "Отмечай страны, которые уже посетил",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
