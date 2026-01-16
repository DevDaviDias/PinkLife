interface GrayMenuProps {
    items:{
    title: string;
    onClick?: () => void;
    active?: boolean;}[];
}

export default function GrayMenu({ items }: GrayMenuProps) {
    return (
        <>
       <div className ="mt-4 flex gap-2 w-full bg-gray-100 p-1 rounded-lg ">
        {items.map((item, index) => (
            <button
                key={index}
                onClick={item.onClick}
                className={`px-3 py-1 rounded-[0.2em] w-full text-[0.9em] font-medium ${item.active ? 'bg-gray-100 text-gray-900' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
            >
                {item.title}
                </button>
        ))}
        </div>
        </>
    );
}