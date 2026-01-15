interface GrayMenuProps {
    items:{
    title: string;
    onClick?: () => void;
    active?: boolean;}[];
}

export default function GrayMenu({ items }: GrayMenuProps) {
    return (
        <>
       <div className ="Flex gap-2 bg-gray100 p-1 reonded-lg w-fit">
        {items.map((item, index) => (
            <button
                key={index}
                onClick={item.onClick}
                className={`px-3 py-1 rounded-lg text-[0.9em] font-medium ${item.active ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
                {item.title}
                </button>
        ))}
        </div>
        </>
    );
}