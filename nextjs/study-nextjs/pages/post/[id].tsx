import Layout from "../../src/components/layout";
import Head from "next/head";
import Date from '../../src/components/date';

export async function getStaticPaths() {
    const res = await fetch('http://makeup-api.herokuapp.com/api/v1/products.json');
    const products = await res.json();

    const paths = products.map((product : any) => ({
        params: { id: product.id.toString()},
    }));

    return {paths, fallback: false};
}

export async function getStaticProps({params}:any){
    const res = await fetch(`http://makeup-api.herokuapp.com/api/v1/products/${params.id}.json`);
    const productsData = await res.json();

    return { props: {productsData}};
}

export default function PostId({productsData}: any) {
    return (
        <Layout>
            <Head><title>{productsData.name}</title></Head>
            <Date Date dateString={productsData.updated_at.toString()} />
            <div>{productsData.name}</div>
        </Layout>
    );
}