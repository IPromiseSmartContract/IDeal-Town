import { readFile } from "fs/promises";

export interface FetchDropsInput {
    limit: number;
    offset: number;
    order?: string;
    key?: string;
    value?: string;
    name?: string;
    nameOrder?: string;
    idOrder?: string;
    withMetadata?: string;
    from?: string;
    to?: string;
    id?: number;
}

export interface CreateDropsInput {
    name: string;
    description: string;
    city: string;
    country: string;
    start_date: string;
    end_date: string;
    expiry_date: string;
    event_url: string;
    virtual_event: boolean;
    image: Blob;
    filename: string;
    contentType: string;
    secret_code: string;
    event_template_id?: number | null;
    email: string;
    requested_codes?: number;
    private_event?: boolean;
}
const today = new Date();
const oneMonthFromToday = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
);
const twoMonthsFromToday = new Date(
    today.getFullYear(),
    today.getMonth() + 2,
    today.getDate(),
);

const toPOAPdate = (date: Date): string => {
    return date
        .toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        })
        .replace(/\//g, '-');
};


export interface CreateDropInput {
    name: string;
    description: string;
    city: string;
    country: string;
    start_date: string;
    end_date: string;
    expiry_date: string;
    event_url: string;
    virtual_event: boolean;
    image: Blob;
    filename: string;
    contentType: string;
    secret_code: string;
    event_template_id?: number | null;
    email: string;
    requested_codes?: number;
    private_event?: boolean;
}
export interface DropResponse {
    id: number;
    fancy_id: string;
    name: string;
    description: string;
    city: string;
    country: string;
    channel: string;
    platform: string;
    location_type: string;
    drop_url: string;
    image_url: string;
    animation_url: string;
    year: number;
    start_date: string;
    timezone: string;
    private: boolean;
    created_date: string;
    attributes_aggregate: {
        aggregate: {
            count: number;
        };
    };
}

async function createDrop(input: CreateDropInput): Promise<Response> {
    const form = new FormData();
    for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
            if (key === 'image') {
                form.append("image", input.image, input.filename);

            } else {
                form.append(key, (input[key] as string) + '');
            }
        }
    }
    return fetch('https://api.poap.tech/events', {
        method: 'POST',
        body: form,
        headers: {
            accept: 'application/json',
            'x-api-key': 'sOaInLMdtvp0fPwhFYM3Fc0sufK5FRN3ABk1zcpbcZfRY5ti9tok1okmCvO6G9tMnh7AdAaFVpJ3otAEaXLGb7MWwV3LV21SawfDW5fFIKovHurocjvN0FGKEoi9uHEH'
        }
    });
}
const main = async () => {
    const input: CreateDropsInput = {
        name: 'Test ' + toPOAPdate(today),
        description: 'Description',
        city: 'Buenos Aires',
        country: 'Argentina',
        start_date: toPOAPdate(today),
        end_date: toPOAPdate(oneMonthFromToday),
        expiry_date: toPOAPdate(twoMonthsFromToday),
        event_url: 'https://poap.xyz/',
        virtual_event: true,
        secret_code: '123456',
        image: new Blob([await readFile("./frontend/src/assets/poap.png")], {
            type: "image/png"
        }),
        filename: 'file.png',
        contentType: 'image/png',
        event_template_id: 1,
        email: 'rodrigo@poap.io',
        requested_codes: 10,
        private_event: true,
    };

    const response = await createDrop(input)
    return response.json()

}
main().then(resj => {
    console.log(resj)
}).catch(error => {
    console.error(error)
})