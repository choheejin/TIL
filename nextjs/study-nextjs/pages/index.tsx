import Image from 'next/image'
import { Inter } from '@next/font/google'
import  Head  from "next/head";
import Layout from "../src/components/layout";
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
      <div className="dark:text-white">
          <Head>
              <title>훌라 | 메인페이지</title>
          </Head>

          <Layout>
              <div>곤란</div>
              <div className="block relative w-full h-40 min-h-40">
                  <Image className="z-0 object-cover max-h-40"  src="https://images.unsplash.com/photo-1672081676292-6b15b11db1af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80" fill alt="프로필"/>
              </div>

              <div>이거지~</div>

              <Link className="text-blue-500 cursor-pointer" href="/about">About me</Link>
          </Layout>
      </div>
  )
}
