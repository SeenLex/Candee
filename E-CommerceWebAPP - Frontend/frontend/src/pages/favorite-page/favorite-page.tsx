import React, { useState, useCallback } from "react";
import './favorite-page.css';
import ProductCard from "../../components/product-card/product-card";
import useFavourite from "../../hooks/useFavourite";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../../components/spinner/spinner";


const FavoritePage = () => {
    const { token } = useAuth();
    const { favourites, loading, setFavourites, removeAllFavourites } = useFavourite(token as string);

    const handleRemoveFavorite = useCallback((productId: string) => {
        setFavourites(prev => prev?.filter(fav => fav.product._id !== productId) || null);
    }, []);

    if (loading) {
        return <div className="main-container">
            <Spinner />
        </div>
    }

    const handleEmptyFavourites = async () => {
        if (!window.confirm("Are you sure you want to remove all favourites?")) return;
        await removeAllFavourites();
        setFavourites(null);
        window.location.reload();
    }

    return (
        <div className="main-container">
            <div className="favourites-title-container">
                <h1>{favourites?.length ? "Your Favourites" : "No favourites"}</h1>
            </div>
            <div className="items-container">
                {favourites?.map((favourite) => (
                    <ProductCard
                        key={favourite?.product._id}
                        product={favourite?.product}
                        loading={loading}
                        isFavourite={true}
                        onFavouriteToggle={handleRemoveFavorite}
                        
                    />
                ))}
            </div>
            {favourites?.length === 0 ? (
                <div className="empty-favourites-container">
                    <h2>You have no favourites saved!</h2>
                </div>
            ) : (
                <div className="empty-button-container">
                    <button onClick={handleEmptyFavourites}>Clear favourites</button>
                </div>
            )}
        </div>
    );
};

export default FavoritePage;