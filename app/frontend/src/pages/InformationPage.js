import React from 'react';
import Container4 from "../components/Container4";
import InformationContainer from "../components/InformationContainer";

const InformationPage = () => {
    return (
        <div>
            <Container4
                headerText="Information"
                paragraphText="This page is intended to provide information about the machine learning models and techniques used for this project."
                buttonText="Read More"
            />
            <InformationContainer
                text={"This will be some relevant information."}
                buttonText={"Generate Visualization"}
            />
        </div>
    );
}

export default InformationPage;