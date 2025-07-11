import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

function App() {
  return (
     <>
      <Navbar />
      <main className="p-4">
        <AppRoutes />
      </main>
    </>
  );
}

export default App;
