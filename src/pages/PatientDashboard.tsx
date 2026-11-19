import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { 
  Activity, 
  AlertTriangle, 
  Bell, 
  Calendar,
  CheckCircle2,
  Pill,
  TrendingDown,
  TrendingUp,
  Heart,
  Thermometer
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PatientDashboard = () => {
  // Mock data for charts
  const biomarkerData = [
    { date: 'Jan 15', IL6: 8.2, CRP: 12.5, MMP9: 145 },
    { date: 'Jan 22', IL6: 7.8, CRP: 11.2, MMP9: 138 },
    { date: 'Jan 29', IL6: 6.5, CRP: 9.8, MMP9: 125 },
    { date: 'Feb 5', IL6: 7.2, CRP: 10.5, MMP9: 132 },
    { date: 'Feb 12', IL6: 5.8, CRP: 8.2, MMP9: 118 },
    { date: 'Feb 19', IL6: 5.2, CRP: 7.5, MMP9: 110 },
    { date: 'Today', IL6: 4.8, CRP: 6.8, MMP9: 105 }
  ];

  const painData = [
    { day: 'Mon', morning: 3, evening: 4 },
    { day: 'Tue', morning: 2, evening: 3 },
    { day: 'Wed', morning: 2, evening: 2 },
    { day: 'Thu', morning: 3, evening: 4 },
    { day: 'Fri', morning: 2, evening: 2 },
    { day: 'Sat', morning: 1, evening: 2 },
    { day: 'Sun', morning: 2, evening: 3 }
  ];

  const medications = [
    { name: "Methotrexate", dosage: "15mg", frequency: "Weekly", nextDose: "Tomorrow", adherence: 95 },
    { name: "Folic Acid", dosage: "5mg", frequency: "Daily", nextDose: "Today 8PM", adherence: 98 },
    { name: "Prednisolone", dosage: "5mg", frequency: "Daily", nextDose: "Today 9AM", adherence: 92 }
  ];

  const alerts = [
    { type: "warning", message: "IL-6 levels trending upward. Consider contacting your rheumatologist.", time: "2 hours ago" },
    { type: "success", message: "Great job! 7-day medication adherence at 95%", time: "1 day ago" },
    { type: "info", message: "Upcoming appointment with Dr. Smith on Feb 25", time: "2 days ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Patient Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Sarah Johnson</p>
          </div>

          {/* Alerts */}
          <div className="grid gap-4 mb-8">
            {alerts.map((alert, index) => (
              <Card 
                key={index} 
                className={`shadow-card ${
                  alert.type === 'warning' ? 'border-l-4 border-l-warning' : 
                  alert.type === 'success' ? 'border-l-4 border-l-success' : 
                  'border-l-4 border-l-primary'
                }`}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-warning" />}
                  {alert.type === 'success' && <CheckCircle2 className="h-5 w-5 text-success" />}
                  {alert.type === 'info' && <Bell className="h-5 w-5 text-primary" />}
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.time}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Disease Activity</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">Low</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <TrendingDown className="h-4 w-4 text-success" />
                  <span>Improving</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Flare Risk</CardTitle>
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18%</div>
                <Progress value={18} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-2">95% AI prediction accuracy</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Medication Adherence</CardTitle>
                  <Pill className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">95%</div>
                <Progress value={95} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Feb 25</div>
                <p className="text-sm text-muted-foreground mt-2">Dr. Smith • 10:00 AM</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="biomarkers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="biomarkers">Biomarkers</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="biomarkers" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Inflammatory Biomarkers Trend</CardTitle>
                  <CardDescription>Real-time monitoring of key inflammation indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={biomarkerData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="IL6" stroke="hsl(var(--primary))" strokeWidth={2} name="IL-6 (pg/mL)" />
                      <Line type="monotone" dataKey="CRP" stroke="hsl(var(--secondary))" strokeWidth={2} name="CRP (mg/L)" />
                      <Line type="monotone" dataKey="MMP9" stroke="hsl(var(--accent))" strokeWidth={2} name="MMP-9 (ng/mL)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">IL-6</CardTitle>
                    <CardDescription>Interleukin-6 Level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success">4.8</div>
                    <p className="text-sm text-muted-foreground">pg/mL</p>
                    <Badge className="mt-2 bg-success/10 text-success">Normal Range</Badge>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">CRP</CardTitle>
                    <CardDescription>C-Reactive Protein</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success">6.8</div>
                    <p className="text-sm text-muted-foreground">mg/L</p>
                    <Badge className="mt-2 bg-success/10 text-success">Low</Badge>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">MMP-9</CardTitle>
                    <CardDescription>Matrix Metalloproteinase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success">105</div>
                    <p className="text-sm text-muted-foreground">ng/mL</p>
                    <Badge className="mt-2 bg-success/10 text-success">Improving</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="symptoms" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Pain Levels - Last 7 Days</CardTitle>
                  <CardDescription>Self-reported pain scores (0-10 scale)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={painData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 10]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Area type="monotone" dataKey="morning" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Morning" />
                      <Area type="monotone" dataKey="evening" stackId="1" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.6} name="Evening" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Log Today's Symptoms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full">Record Pain Score</Button>
                    <Button variant="outline" className="w-full">Track Joint Swelling</Button>
                    <Button variant="outline" className="w-full">Report Fatigue Level</Button>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Recent Entries</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Morning Pain</span>
                      <Badge variant="outline">2/10</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Joint Stiffness</span>
                      <Badge variant="outline">Mild</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Fatigue</span>
                      <Badge variant="outline">Low</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="medications" className="space-y-6">
              <div className="grid gap-4">
                {medications.map((med, index) => (
                  <Card key={index} className="shadow-card">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{med.name}</h3>
                          <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</p>
                        </div>
                        <Pill className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Next dose:</span>
                          <span className="font-medium">{med.nextDose}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Adherence:</span>
                          <span className="font-medium text-success">{med.adherence}%</span>
                        </div>
                        <Progress value={med.adherence} className="h-2 mt-2" />
                      </div>
                      <Button className="w-full mt-4" variant="outline">Mark as Taken</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="shadow-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Drug Sensitivity Analysis
                  </CardTitle>
                  <CardDescription>AI-powered treatment response prediction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Methotrexate Response</span>
                      <Badge className="bg-success text-success-foreground">Good Responder</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Metabolic biomarkers indicate 81% probability of positive response to current dosage
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Continue current treatment plan. Next sensitivity analysis in 4 weeks.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Activity & Movement Patterns</CardTitle>
                  <CardDescription>Wearable sensor data and activity tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Daily Steps</p>
                      <p className="text-3xl font-bold">6,847</p>
                      <Progress value={68} className="h-2" />
                      <p className="text-xs text-muted-foreground">68% of 10,000 goal</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Active Minutes</p>
                      <p className="text-3xl font-bold">42</p>
                      <Progress value={84} className="h-2" />
                      <p className="text-xs text-muted-foreground">84% of 50 min goal</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Joint Mobility</p>
                      <p className="text-3xl font-bold text-success">Good</p>
                      <Badge className="bg-success/10 text-success">Normal Range</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Exercise Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-sm">Gentle Range of Motion</p>
                      <p className="text-xs text-muted-foreground mt-1">15 minutes • Morning</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-sm">Water Aerobics</p>
                      <p className="text-xs text-muted-foreground mt-1">30 minutes • 3x per week</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-sm">Walking</p>
                      <p className="text-xs text-muted-foreground mt-1">20 minutes • Daily</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Sleep Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Last Night</span>
                          <span className="font-medium">7.5 hours</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">85%</p>
                          <p className="text-xs text-muted-foreground">Sleep Quality</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">2</p>
                          <p className="text-xs text-muted-foreground">Interruptions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
