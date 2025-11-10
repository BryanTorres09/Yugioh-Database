import { useState } from "react";
import axios from "axios";

function Form() {

    const [cardName, setCardName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [cardType, setCardType] = useState("");
    const [attribute, setAttribute] = useState("");
    const [level, setLevel] = useState("");
    const [cardImage, setCardImage] = useState(null);
    const [imgselected, setImgselected] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cardImage) {
          alert("Please select a card image!");
          return;
        }

        const formData = new FormData();
        formData.append("CardName", cardName);
        formData.append("Quantity", quantity);
        formData.append("CardType", cardType);
        formData.append("Attribute", attribute);
        formData.append("Level", level);
        formData.append("CardImage", cardImage);

        try {
            const response = await axios.post("http://localhost:3000/upload", formData, {headers: {"Content-Type": "multipart/form-data"}});
            alert("Card uploaded successfully!");

            // Reset form fields
            setCardName("");
            setQuantity("");
            setCardType("");
            setAttribute("");
            setLevel("");
            setCardImage(null);
            setImgselected(false);

        } catch (error) {
            console.error("Error uploading card:", error);
            alert("Error uploading card.");
            }
        }
    

    return (
        <div className="background pt-20 ">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
                
                <form className="flex  flex-col gap-4" onSubmit={handleSubmit} >
                    
                    <input type="text" id="cardname" name="CardName" placeholder="Card Name" value={cardName} required onChange={(e)=>{setCardName(e.target.value)}} />
                    <input type="number" id="quantity" name="Quantity" placeholder="Quantity" value={quantity} onChange={(e)=>{setQuantity(e.target.value)}} />
                    <input type="text" id="cardtype" name="CardType" placeholder="Card Type" value={cardType} onChange={(e) => {setCardType(e.target.value)}}/>
                    <input type="text" id="attribute" name="Attribute" placeholder="Attribute" value={attribute} onChange={(e) => {setAttribute(e.target.value)}} />
                    <input type="number" id="level" name="Level" placeholder="Level" value={level} onChange={(e) => {setLevel(e.target.value)}}/>
                    <input className="hidden" type="file" id="cardimage" name="CardImage" onChange={(e)=>{setCardImage(e.target.files[0]); setImgselected(true);}} required />

                    <label className="mx-auto mt-4 inline-block w-32 text-center bg-blue-500 text-white px-4
                    py-2 rounded cursor-pointer hover:text-fuchsia-700" htmlFor="cardimage">Card Image {imgselected ? "✅" : ""} </label>

                    <button className=" mt-4 bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:text-fuchsia-700"
                     type="submit">Submit</button>
                    
                    

                </form>
            </div>
        </div>
    )
}

export default Form;