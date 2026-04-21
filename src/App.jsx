import { Toaster } from "react-hot-toast";
import AppRoutes from "@/routes/AppRoutes";

function App() {
  return (
    <div
      className="flex flex-col min-h-screen w-full bg-base-200 text-base-content overflow-x-hidden"
    >
      <main className="w-full h-full flex justify-center items-start sm:items-center">
        <div className="w-full h-full">
          <AppRoutes />
        </div>
      </main>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Toaster />
      </div>
    </div>
  );
}

export default App;
