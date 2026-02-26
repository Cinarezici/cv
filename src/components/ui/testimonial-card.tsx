import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
    name: string
    handle: string
    avatar: string
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
                <Avatar className="h-12 w-12 border border-zinc-100 shadow-sm">
                    <AvatarImage src={author.avatar} alt={author.name} />
                </Avatar>
                <div className="flex flex-col items-start">
                    <h3 className="text-md font-semibold font-sans leading-none text-zinc-900">
                        {author.name}
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium">
                        {author.handle}
                    </p>
                </div>
            </div>
            <p className="sm:text-md mt-4 text-sm text-zinc-600 font-medium leading-relaxed">
                {text}
            </p>
        </Card>
    )
}
