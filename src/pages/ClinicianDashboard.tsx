import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "@/components/Navbar";
import { 
  Activity, 
  AlertTriangle, 
  ArrowUpRight,
  Clock,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
  FileText,
  Brain,
  CheckCircle2
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ClinicianDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const patients = [
    { 
      id: 1, 
      name: "Sarah Johnson", 
      age: 42, 
      disease_activity: "Low", 
      flare_risk: 18, 
      last_visit: "2 weeks ago",
      drug_response: "Good",
      status: "stable"
    },
    { 
      id: 2, 
      name: "Michael Chen", 
      age: 55, 
      disease_activity: "Moderate", 
      flare_risk: 45, 
      last_visit: "1 week ago",
      drug_response: "Partial",
      status: "monitor"
    },
    { 
      id: 3, 
      name: "Emma Wilson", 
      age: 38, 
      disease_activity: "High", 
      flare_risk: 72, 
      last_visit: "3 days ago",
      drug_response: "Poor",
      status: "urgent"
    },
    { 
      id: 4, 
      name: "David Martinez", 
      age: 51, 
      disease_activity: "Low", 
      flare_risk: 22, 
      last_visit: "1 month ago",
      drug_response: "Good",
      status: "stable"
    },
    { 
      id: 5, 
      name: "Lisa Anderson", 
      age: 47, 
      disease_activity: "Moderate", 
      flare_risk: 38, 
      last_visit: "1 week ago",
      drug_response: "Good",
      status: "stable"
    }
  ];

  const responseData = [
    { treatment: 'MTX Mono', good: 35, partial: 25, poor: 15 },
    { treatment: 'MTX + Biologic', good: 55, partial: 20, poor: 8 },
    { treatment: 'JAK Inhibitor', good: 48, partial: 22, poor: 12 },
    { treatment: 'Anti-TNF', good: 52, partial: 18, poor: 10 }
  ];

  const flareData = [
    { month: 'Aug', predicted: 12, actual: 10 },
    { month: 'Sep', predicted: 15, actual: 14 },
    { month: 'Oct', predicted: 11, actual: 12 },
    { month: 'Nov', predicted: 18, actual: 17 },
    { month: 'Dec', predicted: 14, actual: 13 },
    { month: 'Jan', predicted: 16, actual: 15 },
    { month: 'Feb', predicted: 13, actual: null }
  ];

  const alerts = [
    { patient: "Emma Wilson", message: "High flare risk (72%) - Consider treatment adjustment", severity: "high" },
    { patient: "Michael Chen", message: "Suboptimal drug response - Metabolic markers suggest switching therapy", severity: "medium" },
    { patient: "Sarah Johnson", message: "Excellent progress - IL-6 levels normalized", severity: "low" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Clinician Dashboard</h1>
            <p className="text-muted-foreground">Dr. Emily Smith, MD • Rheumatology</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span>+3 this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">High Risk Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">3</div>
                <p className="text-xs text-muted-foreground mt-2">Require immediate attention</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Avg. Prediction Accuracy</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">94.7%</div>
                <p className="text-xs text-muted-foreground mt-2">Flare prediction model</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground mt-2">Next: 10:00 AM - S. Johnson</p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Section */}
          <Card className="shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Priority Alerts
              </CardTitle>
              <CardDescription>AI-generated recommendations requiring clinical review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'high' ? 'border-l-destructive bg-destructive/5' :
                    alert.severity === 'medium' ? 'border-l-warning bg-warning/5' :
                    'border-l-success bg-success/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{alert.patient}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    </div>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs defaultValue="patients" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
            </TabsList>

            <TabsContent value="patients" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Patient Overview</CardTitle>
                      <CardDescription>Monitor disease activity and treatment response across your patient panel</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search patients..." className="pl-9 w-[250px]" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Disease Activity</TableHead>
                        <TableHead>Flare Risk</TableHead>
                        <TableHead>Drug Response</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                patient.disease_activity === "Low" ? "bg-success/10 text-success" :
                                patient.disease_activity === "Moderate" ? "bg-warning/10 text-warning" :
                                "bg-destructive/10 text-destructive"
                              }
                            >
                              {patient.disease_activity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={
                                patient.flare_risk < 30 ? "text-success" :
                                patient.flare_risk < 50 ? "text-warning" :
                                "text-destructive"
                              }>
                                {patient.flare_risk}%
                              </span>
                              {patient.flare_risk > 50 && <AlertTriangle className="h-4 w-4 text-destructive" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                patient.drug_response === "Good" ? "bg-success/10 text-success" :
                                patient.drug_response === "Partial" ? "bg-warning/10 text-warning" :
                                "bg-destructive/10 text-destructive"
                              }
                            >
                              {patient.drug_response}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{patient.last_visit}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedPatient(patient)}>
                              View Details
                              <ArrowUpRight className="ml-1 h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Patient Details</DialogTitle>
                    <DialogDescription>Demo patient information for clinician review. This is not live medical data.</DialogDescription>
                  </DialogHeader>
                  {selectedPatient && (
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-semibold">{selectedPatient.name}</h3>
                        <p className="text-sm text-muted-foreground">Age {selectedPatient.age} • Last visit {selectedPatient.last_visit}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Disease Activity</p><p className="font-semibold">{selectedPatient.disease_activity}</p></div>
                        <div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Demo Flare-Risk Score</p><p className="font-semibold">{selectedPatient.flare_risk}%</p></div>
                        <div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Medication Response</p><p className="font-semibold">{selectedPatient.drug_response}</p></div>
                        <div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Monitoring Status</p><p className="font-semibold capitalize">{selectedPatient.status}</p></div>
                      </div>
                      <div className="rounded-lg border p-3 text-sm">
                        <p className="font-medium mb-1">Clinical review reminder</p>
                        <p className="text-muted-foreground">Sample data and unvalidated demo scores only. Do not use for treatment decisions.</p>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Treatment Response Analysis</CardTitle>
                  <CardDescription>Patient outcomes across different therapeutic regimens</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={responseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="treatment" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="good" fill="hsl(var(--success))" name="Good Response" />
                      <Bar dataKey="partial" fill="hsl(var(--warning))" name="Partial Response" />
                      <Bar dataKey="poor" fill="hsl(var(--destructive))" name="Poor Response" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Overall Remission Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success">62%</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span>+8% vs last quarter</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Avg. Time to Remission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">4.2</div>
                    <p className="text-sm text-muted-foreground mt-2">months</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingDown className="h-4 w-4 text-success" />
                      <span>-1.3 months improved</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Drug Sensitivity Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">42</div>
                    <p className="text-sm text-muted-foreground mt-2">completed this month</p>
                    <Badge className="mt-2 bg-success/10 text-success">81% accuracy</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Flare Prediction Performance</CardTitle>
                  <CardDescription>AI model accuracy: Predicted vs. actual disease flares</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={flareData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={2} name="AI Predicted" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="actual" stroke="hsl(var(--secondary))" strokeWidth={2} name="Actual" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Model Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Sensitivity</span>
                      <span className="font-bold text-success">95%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Specificity</span>
                      <span className="font-bold text-success">95%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Positive Predictive Value</span>
                      <span className="font-bold text-success">72%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Negative Predictive Value</span>
                      <span className="font-bold text-success">76%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Drug Response Prediction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Methotrexate</span>
                        <Badge className="bg-success/10 text-success">81% Accuracy</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Based on homocystine & glycerol-3-phosphate levels
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Biologics</span>
                        <Badge className="bg-success/10 text-success">78% Accuracy</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Using TNF-R1, IL-6, and CRP biomarkers
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="research" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Clinical Evidence Base</CardTitle>
                  <CardDescription>Key research supporting RheumaGuard AI predictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg hover:shadow-card transition-shadow">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Metabolic Biomarkers for MTX Response</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Homocystine and glycerol-3-phosphate predict methotrexate response with 81% accuracy
                        </p>
                        <Badge variant="outline">LC-MS/MS Study</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-card transition-shadow">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Wearable Sensor Disease Activity Detection</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Flexible sensors successfully detect activity patterns correlating with RA flares
                        </p>
                        <Badge variant="outline">Clinical Trial</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-card transition-shadow">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">AI Flare Prediction Model Validation</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Machine learning achieves 95% sensitivity and specificity in predicting disease flares
                        </p>
                        <Badge variant="outline">Multi-center Study</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-card transition-shadow">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Digital Biomarkers from Smartphone Data</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Smartphone and smartwatch data show strong associations with disease activity measures
                        </p>
                        <Badge variant="outline">Longitudinal Study</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Clinical Impact Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">For Clinicians</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                          <span>Early detection of treatment failure through baseline biomarker analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                          <span>AI-powered flare prediction supports proactive treatment decisions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                          <span>Continuous monitoring replaces infrequent clinic assessments</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">For Patients</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                          <span>Non-invasive, continuous home monitoring reduces clinic visit burden</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                          <span>Real-time feedback empowers self-management and adherence</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                          <span>Early intervention prevents disease progression and joint damage</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClinicianDashboard;
