import React from "react"
import Image from "next/image";
import Searchbar from "@/components/Searchbar";
import HeroCarousel from "@/components/HeroCarousel";
import { getAllProducts } from "@/lib/actions"
import ProductCard from "@/components/ProductCard";



const Home = async () => {

  const allProducts = await getAllProducts();

  return (
    <>
      <section className="px-6 md:px-20 py-24 border-2 border-red-500">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
            Là où commence le shopping intelligent :
              <Image 
              src="/assets/icons/arrow-right.svg"
              alt="arrow-right"
              width={16}
              height={16}
              />
            </p>
            <h1 className="head-text">
            Libérez la puissance de
              <span className="text-primary"> PriceWise</span>
            </h1>
            <p className="mt-6">
            Une puissante plateforme d’analyse produit
            et de croissance à votre service pour mieux
            convertir, engager et fidéliser.
            </p>

            <Searchbar/>
          </div>

          <HeroCarousel/>
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text">Tendances</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
