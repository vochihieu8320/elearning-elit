import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, BookOpen, ShoppingCart, DollarSign, TrendingUp, TrendingDown
} from "lucide-react";
import ChartComponent from "@/components/ChartComponent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: {
    value: number;
    isIncrease: boolean;
  };
  iconBgColor: string;
  iconColor: string;
}

function StatCard({ title, value, icon, change, iconBgColor, iconColor }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${iconBgColor}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1 text-sm">
          {change.isIncrease ? (
            <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1 text-rose-500" />
          )}
          <span
            className={change.isIncrease ? "text-emerald-500" : "text-rose-500"}
          >
            {change.value}%
          </span>
          <span className="ml-1 text-muted-foreground">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface AdminStatsProps {
  usersCount: number;
  coursesCount: number;
  ordersCount: number;
  revenue: number;
  usersChange: number;
  coursesChange: number;
  ordersChange: number;
  revenueChange: number;
}

export default function AdminStats({
  usersCount,
  coursesCount,
  ordersCount,
  revenue,
  usersChange,
  coursesChange,
  ordersChange,
  revenueChange
}: AdminStatsProps) {
  const [yearFilter, setYearFilter] = useState("2023");
  
  // Mock data for the charts
  const revenueData = [
    { name: "Jan", value: 2400 },
    { name: "Feb", value: 1398 },
    { name: "Mar", value: 9800 },
    { name: "Apr", value: 3908 },
    { name: "May", value: 4800 },
    { name: "Jun", value: 3800 },
    { name: "Jul", value: 4300 },
    { name: "Aug", value: 5300 },
    { name: "Sep", value: 4500 },
    { name: "Oct", value: 7300 },
    { name: "Nov", value: 8900 },
    { name: "Dec", value: 9200 },
  ];
  
  const userSignupsData = [
    { name: "Jan", value: 40 },
    { name: "Feb", value: 35 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 48 },
    { name: "May", value: 52 },
    { name: "Jun", value: 75 },
    { name: "Jul", value: 62 },
    { name: "Aug", value: 59 },
    { name: "Sep", value: 47 },
    { name: "Oct", value: 63 },
    { name: "Nov", value: 72 },
    { name: "Dec", value: 80 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={usersCount.toString()}
          icon={<Users className="h-4 w-4" />}
          change={{ value: usersChange, isIncrease: usersChange > 0 }}
          iconBgColor="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Total Courses"
          value={coursesCount.toString()}
          icon={<BookOpen className="h-4 w-4" />}
          change={{ value: coursesChange, isIncrease: coursesChange > 0 }}
          iconBgColor="bg-amber-100 dark:bg-amber-900/20"
          iconColor="text-amber-500"
        />
        <StatCard
          title="Total Orders"
          value={ordersCount.toString()}
          icon={<ShoppingCart className="h-4 w-4" />}
          change={{ value: ordersChange, isIncrease: ordersChange > 0 }}
          iconBgColor="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-500"
        />
        <StatCard
          title="Revenue"
          value={`$${revenue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
          change={{ value: revenueChange, isIncrease: revenueChange > 0 }}
          iconBgColor="bg-purple-100 dark:bg-purple-900/20"
          iconColor="text-purple-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartComponent
          title="Revenue"
          subtitle="Monthly revenue for the current year"
          data={revenueData}
          chartType="bar"
          dataKey="value"
          filter={
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        <ChartComponent
          title="New Users"
          subtitle="Monthly user registrations"
          data={userSignupsData}
          chartType="line"
          dataKey="value"
          filter={
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      </div>
    </div>
  );
}