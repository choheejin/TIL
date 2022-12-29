import Layout from "../src/components/layout";
import Link from "next/link";

export async function getStaticProps(){
    const res = await fetch('https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline');
    const productsData = await res.json();

    return { props: {productsData}};
}

export default function Post ({productsData}: any){
    return (
        <Layout>
            <div className="grid grid-cols-3">
                {
                    productsData.map((product : any) => {
                        return (
                            <Link href={`/post/`+ product.id} className="cursor-pointer">
                                <div>{product.brand}</div>
                                <div>{product.name}</div>
                                <div>{product.price}</div>
                                <div>{product.description}</div>
                            </Link>
                        );
                    })
                }
            </div>
        </Layout>
    );
}