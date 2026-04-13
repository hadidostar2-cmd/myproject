import { VerifiedIcon } from "lucide-react";
import { cn } from "../../utils";

interface ReplyProps {
    authorName: string;
    authorHandle: string;
    authorImage: string;
    content: string;
    isVerified?: boolean;
    timestamp: string;
}

interface XCardProps {
    link?: string;
    authorName: string;
    authorHandle: string;
    authorImage: string;
    content: string[];
    isVerified?: boolean;
    timestamp: string;
    reply?: ReplyProps;
}

function XCard({
    link = "#",
    authorName,
    authorHandle,
    authorImage,
    content,
    isVerified = true,
    timestamp,
    reply,
}: XCardProps) {
    return (
        <div
            className={cn(
                "w-full p-1.5 rounded-2xl relative isolate overflow-hidden",
                "bg-surface backdrop-blur-xl",
                "border border-border",
                "shadow-xl",
                "will-change-transform translate-z-0"
            )}
        >
            <div
                className={cn(
                    "w-full p-5 rounded-xl relative",
                    "bg-gradient-to-br from-burgundy/5 to-transparent",
                    "text-ink",
                    "shadow-sm",
                    "will-change-transform translate-z-0"
                )}
            >
                <div className="flex gap-3">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-border">
                            <img
                                src={authorImage}
                                alt={authorName}
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-ink hover:underline cursor-pointer">
                                        {authorName}
                                    </span>
                                    {isVerified && (
                                        <VerifiedIcon className="h-4 w-4 text-blue-400" />
                                    )}
                                </div>
                                <span className="text-ink/60 text-sm">
                                    @{authorHandle}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    {content.map((item, index) => (
                        <p
                            key={index}
                            className="text-ink/90 text-base leading-relaxed"
                        >
                            {item}
                        </p>
                    ))}
                    <span className="text-ink/40 text-sm mt-2 block">
                        {timestamp}
                    </span>
                </div>

                {reply && (
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full overflow-hidden border border-border">
                                    <img
                                        src={reply.authorImage}
                                        alt={reply.authorName}
                                        className="h-full w-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-ink hover:underline cursor-pointer">
                                        {reply.authorName}
                                    </span>
                                    {reply.isVerified && (
                                        <VerifiedIcon className="h-4 w-4 text-blue-400" />
                                    )}
                                    <span className="text-ink/60 text-sm">
                                        @{reply.authorHandle}
                                    </span>
                                    <span className="text-ink/60 text-sm">
                                        ·
                                    </span>
                                    <span className="text-ink/60 text-sm">
                                        {reply.timestamp}
                                    </span>
                                </div>
                                <p className="text-ink/80 text-sm mt-1">
                                    {reply.content}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


export { XCard }
