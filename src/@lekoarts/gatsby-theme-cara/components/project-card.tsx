/** @jsx jsx */
import { jsx } from "theme-ui"

type ProjectCardProps = {
  link: string
  title: string
  children: React.ReactNode
  bg: string
}

const ProjectCard = ({ link, title, children, bg }: ProjectCardProps) => (
  <a
    href={link}
    target="_blank"
    rel="noreferrer noopener"
    sx={{
      width: `100%`,
      boxShadow: `0 10px 24px rgba(0, 0, 0, 0.2)`,
      position: `relative`,
      textDecoration: `none`,
      borderRadius: `lg`,
      px: 4,
      py: [4, 4],
      color: `white`,
      background: bg || `none`,
      transition: `box-shadow 0.2s ease-in-out`,
      "&:hover": {
        color: `white !important`,
        boxShadow: `0 14px 30px rgba(0, 0, 0, 0.26)`,
      },
    }}
  >
    <div sx={{ opacity: 0.9 }}>{children}</div>
    <div
      sx={{
        textTransform: `none`,
        letterSpacing: `normal`,
        pt: 3,
        fontSize: [3, 4],
        fontWeight: `medium`,
        lineHeight: 1.25,
      }}
    >
      {title}
    </div>
  </a>
)

export default ProjectCard
