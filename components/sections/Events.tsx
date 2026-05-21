export default function Events() {
    return (
        <div className="w-full flex flex-col gap-8">
            <h1 className="ml-3 text-xl after:block after:mt-1 after:h-px after:w-50 after:bg-current"> Calendar </h1>           
            <div className="w-full aspect-video">
                <iframe 
                    title="Google Calendar" 
                    src="https://calendar.google.com/calendar/embed?src=aa9a103be92a0cedc650df8f8a8931357f3c988b0d8faf7120d3cc17b6f37eeb%40group.calendar.google.com&ctz=America%2FChicago&showTitle=0&showPrint=0&showTz=0&showCalendars=0" 
                    className="w-full h-full border-0 invert hue-rotate-180"
                />
            </div>
        </div>
    );
}