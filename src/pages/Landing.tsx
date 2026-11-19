import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { 
  Activity, 
  AlertCircle, 
  BarChart3, 
  Bell, 
  Brain, 
  Clock, 
  Heart, 
  Shield, 
  Smartphone, 
  TrendingUp,
  Users,
  Zap,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-medical.jpg";

const Landing = () => {
  const features = [
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Continuous biomarker tracking with wearable sensors measuring IL-6, MMP-9, and CRP levels"
    },
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description: "95% accuracy in predicting disease flares using machine learning algorithms"
    },
    {
      icon: AlertCircle,
      title: "Drug Sensitivity Detection",
      description: "81% accuracy in identifying methotrexate non-responders through metabolic profiling"
    },
    {
      icon: Smartphone,
      title: "Mobile App Integration",
      description: "Daily PROs, pain scores, and medication adherence tracking on your smartphone"
    },
    {
      icon: BarChart3,
      title: "Clinical Dashboard",
      description: "Comprehensive analytics with EMR integration for rheumatologists"
    },
    {
      icon: Bell,
      title: "Proactive Alerts",
      description: "Real-time notifications for treatment adjustments before clinical deterioration"
    }
  ];

  const biomarkers = [
    { name: "Inflammatory Markers", items: ["IL-6", "MMP-9", "CRP", "TNF-R1"] },
    { name: "Metabolic Biomarkers", items: ["Homocystine", "Glycerol-3-phosphate", "Leptin"] },
    { name: "Activity Patterns", items: ["Joint Movement", "Swelling Detection", "VCAM-1"] }
  ];

  const plans = [
    {
      name: "Patient Basic",
      price: "₹2,999",
      period: "per month",
      description: "Essential monitoring for individual patients",
      features: [
        "Real-time biomarker tracking",
        "Mobile app access",
        "Daily symptom logging",
        "Basic flare predictions",
        "Medication reminders",
        "Monthly reports"
      ]
    },
    {
      name: "Patient Premium",
      price: "₹4,999",
      period: "per month",
      description: "Advanced AI-powered patient care",
      features: [
        "Everything in Basic",
        "Advanced AI predictions (95% accuracy)",
        "Drug sensitivity analysis",
        "Real-time clinician alerts",
        "Wearable sensor integration",
        "Unlimited consultations",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Clinician Pro",
      price: "₹14,999",
      period: "per month",
      description: "Comprehensive practice management",
      features: [
        "Up to 50 patients",
        "Complete clinical dashboard",
        "EMR integration",
        "Treatment recommendations",
        "Advanced analytics",
        "Multi-provider access",
        "API access",
        "Dedicated support"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "For hospitals and large practices",
      features: [
        "Unlimited patients",
        "Custom EMR integration",
        "White-label options",
        "On-premise deployment",
        "Advanced security",
        "SLA guarantees",
        "Training & onboarding",
        "24/7 support"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered RA Management
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transforming{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Rheumatoid Arthritis
                </span>{" "}
                Care
              </h1>
              <p className="text-xl text-muted-foreground">
                Real-time biomarker monitoring with AI-powered drug sensitivity detection. 
                Predict flares with 95% accuracy and optimize treatment before symptoms worsen.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/#features">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">400K+ RA Patients</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">95% Accuracy</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="AI-powered healthcare monitoring" 
                className="rounded-2xl shadow-hover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="outline" className="mb-4">The Challenge</Badge>
            <h2 className="text-4xl font-bold">Why Current RA Monitoring Falls Short</h2>
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <Card className="shadow-card">
                <CardHeader>
                  <Clock className="h-12 w-12 text-warning mb-4" />
                  <CardTitle>3-5 Years</CardTitle>
                  <CardDescription>Average diagnostic delay before symptom onset detection</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-card">
                <CardHeader>
                  <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                  <CardTitle>20-40%</CardTitle>
                  <CardDescription>Patients exhibit drug resistance to standard therapies</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-card">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle>6 Months</CardTitle>
                  <CardDescription>Gap between clinic visits missing critical disease fluctuations</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Comprehensive RA Management Platform</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Integrated system combining wearables, mobile monitoring, and AI-powered clinical decision support
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-hover transition-shadow">
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Biomarkers Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Clinical Evidence</Badge>
            <h2 className="text-4xl font-bold mb-4">Validated Biomarker Analysis</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Continuous monitoring of clinically proven biomarkers for early detection and treatment optimization
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {biomarkers.map((category, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <Heart className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing for patients and healthcare providers. All prices in Indian Rupees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`shadow-card hover:shadow-hover transition-all ${
                  plan.popular ? 'border-primary border-2 relative' : ''
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="min-h-12">{plan.description}</CardDescription>
                  <div className="pt-4">
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">{plan.period}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth" className="block">
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-primary' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-primary-foreground">
              Ready to Transform Your RA Care?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join thousands of patients and clinicians using RheumaGuard AI for better outcomes
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <span className="bg-gradient-primary bg-clip-text text-transparent">RheumaGuard AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered rheumatoid arthritis monitoring and drug sensitivity detection
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/patient" className="hover:text-primary transition-colors">Patient Portal</Link></li>
                <li><Link to="/clinician" className="hover:text-primary transition-colors">Clinician Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Research</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 RheumaGuard AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
