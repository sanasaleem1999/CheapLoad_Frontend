import React from "react";
import MultiColumnTemplate from "../Components/Template/MultiColumnTemplate";
import shipperImg from "../Components/Assets/fullshipper.jpg";
import ShippingQuoteForm from "../Components/Posts/shippingQuote";
import UserHeader from "../Components/Dashboard/userHeader";
import CreatePost from "../Components/Posts/CreatePost";

const ShippingForm = (
    <div style={{ background: '#FDF8ED', borderRadius: 12, padding: 20, boxShadow: '0 2px 12px rgba(32,44,88,0.08)', color: '#1F2B56', fontFamily: 'serif', fontSize: 16 }}>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Add Your Posts to Get Attraction and Get Moving</li>
        </ul>
    </div>
);

const AddPostsPage = () => {
    return (
        <>
        <CreatePost />
            {/* <UserHeader />
            <MultiColumnTemplate
                imageSrc={shipperImg}
                heading="Add Posts"
                subheading="Posts Add Here"
                rightComponent={<ShippingQuoteForm />}
                extraInfo={ShippingForm}
            /> */}
        </>
    );
};

export default AddPostsPage;
