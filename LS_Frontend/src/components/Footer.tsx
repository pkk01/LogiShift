import { Code2, Github, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-10 border-t-2 border-gray-100 bg-surface">
      <div className="w-full px-4 py-3 grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Left: rights */}
        <p className="text-sm text-textSecondary justify-self-start">© {new Date().getFullYear()} LogiShift. All rights reserved.</p>

        {/* Center: developer credit */}
        <div className="text-sm text-textPrimary justify-self-center flex items-center gap-2 justify-center">
          <Code2 className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="leading-tight">Designed & Built by <span className="font-bold">Pratham Kumar</span></span>
        </div>

        {/* Right: icons only */}
        <div className="flex items-center gap-3 justify-self-end">
          <a
            href="https://github.com/pkk01/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border-2 border-gray-200 hover:bg-primary/5 transition-all"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github className="w-4 h-4 text-textPrimary" />
          </a>
          <a
            href="https://www.linkedin.com/in/prathamkumar01/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border-2 border-gray-200 hover:bg-primary/5 transition-all"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-textPrimary" />
          </a>
        </div>
      </div>
    </footer>
  )
}
