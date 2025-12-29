const  fetchCredit = async (id,media)=>{
       
        const data =  await fetch(`https://api.themoviedb.org/3/${media}/${id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`)
        const res =  await data.json();
        console.log(res)
        return res 

}


export {fetchCredit}
