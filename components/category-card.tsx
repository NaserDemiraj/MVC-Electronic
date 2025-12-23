import Link from "next/link"
import {
  Laptop,
  Smartphone,
  Headphones,
  Cable,
  Watch,
  Tv,
  Speaker,
  Camera,
  Gamepad,
  Printer,
  Cpu,
  Activity,
  Package,
  PenToolIcon as Tool,
  PinIcon as Chip,
} from "lucide-react"

interface CategoryCardProps {
  name: string
  icon: string
}

export default function CategoryCard({ name, icon }: CategoryCardProps) {
  const getIcon = () => {
    switch (icon.toLowerCase()) {
      case "laptop":
        return <Laptop className="h-8 w-8" />
      case "smartphone":
        return <Smartphone className="h-8 w-8" />
      case "headphones":
        return <Headphones className="h-8 w-8" />
      case "cable":
        return <Cable className="h-8 w-8" />
      case "watch":
        return <Watch className="h-8 w-8" />
      case "tv":
        return <Tv className="h-8 w-8" />
      case "speaker":
        return <Speaker className="h-8 w-8" />
      case "camera":
        return <Camera className="h-8 w-8" />
      case "gamepad":
        return <Gamepad className="h-8 w-8" />
      case "printer":
        return <Printer className="h-8 w-8" />
      case "cpu":
        return <Cpu className="h-8 w-8" />
      case "activity":
        return <Activity className="h-8 w-8" />
      case "package":
        return <Package className="h-8 w-8" />
      case "tool":
        return <Tool className="h-8 w-8" />
      case "chip":
        return <Chip className="h-8 w-8" />
      default:
        return <Cpu className="h-8 w-8" />
    }
  }

  return (
    <Link href={`/category/${name.toLowerCase()}`}>
      <div className="flex flex-col items-center p-6 rounded-2xl bg-white border border-violet-100 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/40 transition-all group">
        <div className="p-4 rounded-full bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-600 mb-4 group-hover:scale-110 transition-transform">
          {getIcon()}
        </div>
        <span className="font-medium text-center group-hover:text-violet-600 transition-colors">{name}</span>
      </div>
    </Link>
  )
}
