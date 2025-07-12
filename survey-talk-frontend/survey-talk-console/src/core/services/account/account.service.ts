import { ApolloClient } from "@apollo/client";
import { CHAT_MESSAGES_BY_1V1, CHAT_ROOMS_BY_ACCOUNT_ID } from "../../graphql/query/chat.query";
import { SEND_MESSAGE } from "../../graphql/mutation/chat.mutation";
import { AxiosInstance } from "axios";
import { callGraphQLMutation, callGraphQLQuery } from "../../api/graphql/main/api-call";
import { callAxiosRestApi } from "../../api/rest-api/main/api-call";


export const getCustomerAccounts = async (instance: AxiosInstance) => {  

    const response = await callAxiosRestApi({
        instance: instance,
        method: "get",
        url: "/User/accounts/customer",
    });

    return response;
}

export const getManagerAccounts = async (instance: AxiosInstance) => {  

    const response = await callAxiosRestApi({
        instance: instance,
        method: "get",
        url: "/User/accounts/staff",
    });

    return response;
}