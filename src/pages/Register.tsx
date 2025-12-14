import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Register = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const { setUser, handleLogin, userId } = useApp();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		termsAccepted: false,
	});

	const [termsExpanded, setTermsExpanded] = useState(false);
	const [termsViewed, setTermsViewed] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.termsAccepted) {
			toast({
				title: "Términos Requeridos",
				description: "Por favor acepta los términos para continuar.",
				variant: "destructive",
			});
			return;
		}

		if (!formData.email || !formData.password || !formData.name) {
			toast({
				title: "Información Incompleta",
				description: "Por favor completa todos los campos.",
				variant: "destructive",
			});
			return;
		}

		// Validación simple de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			toast({
				title: "Correo Inválido",
				description: "Por favor ingresa un correo electrónico válido.",
				variant: "destructive",
			});
			return;
		}

		// 1. Guardar datos del nuevo usuario en el contexto
		setUser({
			name: formData.name,
			email: formData.email,
			registeredAt: new Date().toISOString(),
		});

		// 2. Guardar usuario registrado en localStorage (simulación)
		const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
		registeredUsers.push(formData.email);
		localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

		// 3. Iniciar sesión inmediatamente (simulación de login exitoso)
		
		// Utilizamos una simulación de ID si userId es null, para garantizar el flujo
		const effectiveUserId = userId || crypto.randomUUID(); 
		
		// FIX CLAVE: Llamar a handleLogin y luego forzar la navegación al Dashboard.
		// handleLogin ya debería establecer la bandera de sesión.
		handleLogin(effectiveUserId); 

		toast({
			title: "¡Bienvenido a Klimba!",
			description: "Tu cuenta ha sido creada exitosamente.",
		});
		
		// Redirigimos explícitamente para asegurar la transición inmediata.
		navigate("/dashboard"); 

	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
			<Header />

			<main className="flex-1 container mx-auto px-4 py-12">
				<div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">
					{/* Formulario de Registro */}
					<Card className="p-8 animate-fade-in">
						<h2 className="text-3xl font-bold text-foreground mb-2">Crea tu Cuenta</h2>
						<p className="text-muted-foreground mb-6">Comienza tu viaje financiero hoy</p>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Nombre</Label>
								<Input
									id="name"
									type="text"
									placeholder="Tu nombre completo"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Correo Electrónico</Label>
								<Input
									id="email"
									type="email"
									placeholder="tu@correo.com"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Contraseña</Label>
								<Input
									id="password"
									type="password"
									placeholder="Crea una contraseña segura"
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									required
								/>
							</div>

							{/* Sección de Términos y Condiciones */}
							<div className="space-y-3">
								<Collapsible open={termsExpanded} onOpenChange={(open) => {
									setTermsExpanded(open);
									if (open) setTermsViewed(true);
								}}>
									<CollapsibleTrigger asChild>
										<Button
											type="button"
											variant="outline"
											className="w-full justify-between text-left font-normal"
										>
											<span className="flex items-center gap-2">
												<FileText className="h-4 w-4 text-growth" />
												Ver Términos y Condiciones
											</span>
											{termsExpanded ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
									 </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="max-h-48 overflow-y-auto p-4 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground space-y-3">
                      <h4 className="font-semibold text-foreground">Términos y Condiciones de Klimba</h4>
                      <p><strong>1. Uso del servicio:</strong> Klimba es una plataforma de organización y educación financiera. El usuario acepta usarla como herramienta de apoyo y entiende que no reemplaza asesoría financiera profesional.</p>
                      <p><strong>2. Registro de información:</strong> La información ingresada (deudas, ingresos, gastos) es responsabilidad del usuario. Klimba no garantiza resultados financieros específicos.</p>
                      <p><strong>3. Simuladores y recomendaciones:</strong> Las simulaciones y recomendaciones son estimaciones basadas en los datos ingresados por el usuario y deben usarse solo como referencia.</p>
                      <p><strong>4. Disponibilidad del servicio:</strong> El servicio puede ser actualizado, modificado o mejorado sin previo aviso.</p>
                      <p><strong>5. Cuenta Premium:</strong> Algunas funciones avanzadas pueden requerir una versión Premium. El usuario decide libremente si desea adquirirla.</p>
                      <p><strong>6. Protección de datos:</strong> Klimba protege la información del usuario conforme a su política de privacidad.</p>
                      <p><strong>7. Aceptación:</strong> Al registrar una cuenta y marcar la casilla, el usuario confirma que ha leído y acepta estos términos.</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

								<div className="flex items-center space-x-2">
									<Checkbox
										id="terms"
										checked={formData.termsAccepted}
										onCheckedChange={(checked) =>
											setFormData({ ...formData, termsAccepted: checked as boolean })
										}
										disabled={!termsViewed}
									/>
									<label
										htmlFor="terms"
										className={`text-sm leading-none ${
											termsViewed
												? "text-foreground cursor-pointer"
												: "text-muted-foreground/50 cursor-not-allowed"
											}`}
									>
										Acepto los términos y condiciones
										{!termsViewed && (
											<span className="block text-xs text-muted-foreground mt-1">
												(Primero debes ver los términos)
											</span>
										)}
									</label>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full bg-growth hover:bg-growth/90 text-white"
								size="lg"
							>
								Entrar a mi Jardín Financiero
							</Button>
						</form>

						<p className="text-center text-sm text-muted-foreground mt-6">
							¿Ya tienes una cuenta?{" "}
							<Link to="/login" className="text-growth hover:underline font-medium">
								Iniciar sesión
							</Link>
						</p>
					</Card>

					{/* Tarjeta de Seguridad (Branding Klimba) */}
					<Card className="p-8 bg-gradient-to-br from-trust-light to-card border-trust/20 animate-scale-in">
						<div className="flex flex-col items-center text-center space-y-4">
							<div className="p-4 rounded-full bg-trust/20">
								<Lock className="h-12 w-12 text-trust" />
							</div>
							<h3 className="text-2xl font-semibold text-foreground">Tu Privacidad es Importante</h3>
							<p className="text-muted-foreground">
								No solicitamos datos bancarios ni información financiera sensible.
								Klimba te ayuda a organizar y estrategizar sin comprometer tu seguridad.
							</p>
							<div className="pt-4 space-y-2 text-sm text-muted-foreground">
								<p>✓ Sin vinculación de cuentas bancarias</p>
								<p>✓ Almacenamiento de datos encriptado</p>
								<p>✓ Control total de privacidad</p>
							</div>
						</div>
					</Card>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default Register;