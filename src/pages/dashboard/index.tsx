import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDecodedDataQuery } from "@/features/decoded-data/hooks";
import { useGetDevicesQuery } from "@/features/devices/hooks";
import { useGetGatewaysQuery } from "@/features/gateways/hooks";
import { useGetRulesQuery } from "@/features/rules/hooks";
import {
  Activity,
  Cpu,
  ExternalLink,
  Network,
  Router as RouterIcon,
  ShieldCheck,
  Signal,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const { data: gateways = [] } = useGetGatewaysQuery();
  const { data: devicesData } = useGetDevicesQuery({ maxResults: 100 });
  const { data: rules = [] } = useGetRulesQuery();
  const { data: recentData } = useGetDecodedDataQuery({ limit: 10 });

  const devices = devicesData?.items || [];
  const activeGateways = gateways.filter((gw) => {
    // Simple mock logic for dashboard if real status isn't easily accessible here
    // In production we'd use the same logic as gateways page
    return true;
  }).length;

  const stats = [
    {
      title: "Total Gateways",
      value: gateways.length,
      icon: Network,
      description: "Active LoRaWAN gateways",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Connected Devices",
      value: devices.length,
      icon: Cpu,
      description: "Provisioned endpoints",
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      title: "Active Rules",
      value: rules.filter((r) => !r.ruleDisabled).length,
      icon: ShieldCheck,
      description: "Data processing pipelines",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Recent Uplinks",
      value: recentData?.items?.length || 0,
      icon: Activity,
      description: "Messages in last 24h",
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  // Mock chart data - in a real app this would come from an analytics endpoint
  const chartData = [
    { time: "00:00", value: 30 },
    { time: "04:00", value: 45 },
    { time: "08:00", value: 75 },
    { time: "12:00", value: 60 },
    { time: "16:00", value: 90 },
    { time: "20:00", value: 65 },
    { time: "23:59", value: 40 },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor your IoT infrastructure and data streams in real-time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Signal className="h-5 w-5 text-primary" />
              Network Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Uplinks
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/decoded-data">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentData?.items?.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">
                      {item.device_id}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="flat"
                      colorVariant={
                        item.leak_detected ? "destructive" : "success"
                      }
                      className="text-[10px]"
                    >
                      {item.leak_detected ? "Leak" : "Normal"}
                    </Badge>
                  </div>
                </div>
              ))}
              {!recentData?.items?.length && (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No recent activity detected
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-sm hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer group">
          <CardHeader className="pb-2">
            <RouterIcon className="h-8 w-8 text-info mb-2 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-lg">Gateways</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage your network infrastructure and view gateway health.
            </p>
            <Button
              variant="link"
              className="px-0 mt-4 h-auto text-primary"
              asChild
            >
              <Link to="/gateways" className="flex items-center gap-1">
                Go to Gateways <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer group">
          <CardHeader className="pb-2">
            <Cpu className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-lg">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Provision endpoints and monitor device connectivity status.
            </p>
            <Button
              variant="link"
              className="px-0 mt-4 h-auto text-primary"
              asChild
            >
              <Link to="/devices" className="flex items-center gap-1">
                Manage Devices <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:ring-1 hover:ring-primary/20 transition-all cursor-pointer group">
          <CardHeader className="pb-2">
            <ShieldCheck className="h-8 w-8 text-success mb-2 group-hover:scale-110 transition-transform" />
            <CardTitle className="text-lg">Processing Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure data targets and processing pipelines for your data.
            </p>
            <Button
              variant="link"
              className="px-0 mt-4 h-auto text-primary"
              asChild
            >
              <Link to="/rules" className="flex items-center gap-1">
                View Rules <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
