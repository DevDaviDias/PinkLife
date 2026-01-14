
type propsTitle ={
        title: string
    }
export default function TitleSection({title}: propsTitle){
    
    return(
    <>
        <h2 className="text-pink-400 text-2xl font-bold">{title}</h2>
        </>
    )
}