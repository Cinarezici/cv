import { cn } from "@/lib/utils"
import { CompanyLogo, CompanyLogoName } from "@/components/ui/company-logos"

export interface TestimonialAuthor {
    name: string
    handle: string
    avatar?: string
    initials?: string
    color?: string
    companyLogoName?: CompanyLogoName
}

export interface TestimonialCardProps {
    author: TestimonialAuthor
    text: string
    href?: string
    className?: string
}

export function TestimonialCard({
    author,
    text,
    href,
    className
}: TestimonialCardProps) {
    const Card = href ? 'a' : 'div'

    return (
        <Card
            {...(href ? { href } : {})}
            className={cn(
                "flex flex-col rounded-lg border-t",
                "bg-white border border-zinc-100 shadow-sm",
                "p-4 text-start sm:p-6",
                "hover:bg-zinc-50 hover:shadow-md",
                "max-w-[320px] sm:max-w-[320px]",
                "transition-all duration-300",
                className
            )}
        >
            <div className="flex items-center gap-3">
                {author.initials ? (
                    <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ backgroundColor: author.color || "#3b82f6" }}
                    >
                        {author.initials}
                    </div>
                ) : author.avatar ? (
                    <img
                        src={author.avatar}
                        alt={author.name}
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        className="h-10 w-10 rounded-full object-cover border border-zinc-100 shadow-sm bg-zinc-100"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 text-sm font-bold shrink-0">
                        {author.name.split(" ").map(n => n[0]).join("")}
                    </div>
                )}
                <div className="flex flex-col items-start">
                    <h3 className="text-md font-semibold font-sans leading-none text-zinc-900">
                        {author.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <p className="text-sm text-zinc-500 font-medium">
                            {author.handle}
                        </p>
                        {author.companyLogoName && (
                            <>
                                <span className="text-zinc-300 text-xs">•</span>
                                <CompanyLogo name={author.companyLogoName} className="h-3 opacity-60 max-w-[52px]" />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <p className="sm:text-md mt-4 text-sm text-zinc-600 font-medium leading-relaxed">
                {text}
            </p>
        </Card>
    )
}
