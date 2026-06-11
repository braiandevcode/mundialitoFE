interface IFootballIconProps {
  className?: string
}

export default function FootballIcon({ className }: IFootballIconProps) {
  return (
    <img
      src="/logo.webp"
      alt="MundialitoApp"
      className={`dark:invert ${className ?? ''}`}
    />
  )
}
