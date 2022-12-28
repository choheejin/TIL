import Layout from "../src/components/layout";

export async function getStaticProps(){
    const res = await fetch('http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline');
    const productsData = await res.json();

    return { props: {productsData} };
}

export default function Post ({productsData}: any){
    return (
        <Layout>
            {
                productsData.map((product : any) => {
                    return (
                        <div>
                            <div>{product.brand}</div>
                            <div>{product.name}</div>
                            <div>{product.price}</div>
                            <div>{product.description}</div>
                        </div>
                    );
                })
            }
        </Layout>
    );
}