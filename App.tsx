import Router from "./router";
import { QueryProvider } from "./API/react-query";

export default function App() {
  return (
    <QueryProvider>
      <Router />
    </QueryProvider>
  );
}
