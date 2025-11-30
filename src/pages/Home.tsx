import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { Leaf, Star } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* HEADER */}
      <header className="bg-white border-b py-4 px-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-2 rounded-lg">
            <Leaf className="h-6 w-6 text-growth" />
          </div>
          <span className="font-bold text-2xl text-gray-800 tracking-tight">FinMate</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-growth transition-colors">Acerca de</a>
          <a href="#" className="hover:text-growth transition-colors">Preguntas</a>
          <a href="#" className="hover:text-growth transition-colors">Contacto</a>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL (HERO) */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-white to-gray-50">
        
        <div className="w-full max-w-4xl text-center space-y-8 animate-fade-in">
          <Card className="bg-white p-12 md:p-16 rounded-3xl shadow-xl border-none ring-1 ring-gray-100">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
              FinMate — Tu <br />
              <span className="text-growth">Compañero Financiero</span>
            </h1>
            
            <p className="text-gray-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Haz crecer tu jardín financiero con herramientas simples para gestionar 
              deudas, seguir tu progreso y aprender estrategias inteligentes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                onClick={() => navigate("/register")}
                className="bg-growth hover:bg-growth/90 text-white font-bold px-10 py-7 text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              >
                Crear Cuenta
              </Button>
              
              <Button 
                onClick={() => navigate("/login")}
                variant="outline"
                className="border-2 border-growth text-growth hover:bg-green-50 font-bold px-10 py-7 text-lg rounded-xl w-full sm:w-auto transition-all duration-300"
              >
                Iniciar Sesión
              </Button>
            </div>
          </Card>
        </div>

        {/* TESTIMONIOS */}
        <div className="mt-24 w-full max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Lo Que Dicen Nuestros Usuarios
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "El servicio es excelente. Me ayudó a organizar mis deudas de manera simple.", author: "María G." },
              { text: "Me ayudó a organizar mis deudas. Muy fácil de usar y sin complicaciones.", author: "Carlos R." },
              { text: "Muy fácil de usar. La planta que crece me motiva a seguir pagando mis deudas.", author: "Ana L." }
            ].map((item, i) => (
              <Card key={i} className="p-8 border-none shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[1,2,3,4,5].map(star => <Star key={star} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-gray-600 italic leading-relaxed mb-4">
                  "{item.text}"
                </p>
                <p className="text-sm font-bold text-gray-800 text-right">— {item.author}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;