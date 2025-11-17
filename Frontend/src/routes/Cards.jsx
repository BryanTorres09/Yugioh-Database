import{useState,useEffect} from "react";
import axios from "axios";



function Cards() {
    const [cards,setCards] = useState ([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_CARDS}`)
        .then ((response) => {
            setCards (response.data);
        })
        .catch ((error) => {
            console.error ('Error fetching cards:', error);
        });
    }, []);



    return (
        <div className="flex gap-2 card-list ">
            {cards.map ((card) => (
                <div key={card.id} className="border p-4 rounded shadow-md bg-white">
                    <img src={`${card.image_url}`} alt={card.cardname} 
                    className="w-41 h-60 object-cover mx-auto"/>

                </div>
            ))}
            
        </div>
    )
}
   
export default Cards;