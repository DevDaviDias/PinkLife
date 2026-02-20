
type propsTitle ={
        title: string
    }
export default function TitleSection({title}: propsTitle){
    
    return(
    <>
        <h2 className="text-pink-400 mt-8  text-3xl font-bold">{title}</h2>
        </>
    )
}