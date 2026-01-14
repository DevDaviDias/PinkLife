
type propsTitle ={
        title: string
    }
export default function TitleSection({title}: propsTitle){
    
    return(
    <>
        <h2>{title}</h2>
        </>
    )
}