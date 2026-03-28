import {useNavigate} from "react-router-dom";

import headphone from "../images/headphone.jpg";
import phone from "../images/phone.jpg";
import laptop from "../images/laptop.jpg";

function Home(){

const navigate = useNavigate();

const products = [

{
id:1,
name:"Wireless Headphones",
price:3000,
image:headphone,
description:"High quality wireless headphones"
},

{
id:2,
name:"Smart Phone",
price:20000,
image:phone,
description:"Latest smartphone with amazing camera"
},

{
id:3,
name:"Laptop",
price:50000,
image:laptop,
description:"Powerful laptop for coding and gaming"
}

];

return(

<div>

<h2>Products</h2>

{products.map(product=>(
<div key={product.id} style={{border:"1px solid gray",margin:"10px",padding:"10px"}}>

<img src={product.image} width="200"/>

<h3>{product.name}</h3>

<p>₹{product.price}</p>

<button onClick={()=>navigate(`/product/${product.id}`)}>
View Details
</button>

</div>
))}

</div>

)

}

export default Home;