const host = "https://api.poap.tech"
const apiKey = import.meta.env.VITE_API_KEY || '';
const authToken = import.meta.env.AUTHTOKEN || '';

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
    image: string;
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
    image: string;
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

export async function createDrop(input: CreateDropInput) {
    const form = new FormData();
    for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
            // if (key === 'image') {
            //     form.append("image", input.image, input.filename);

            // } else {
            //     form.append(key, (input[key] as string) + '');
            // }
            form.append(key, (input[key] as string) + '');
        }
    }
    return fetch(`${host}/events`, {
        method: 'POST',
        body: form,
        headers: {
            accept: 'application/json',
            'x-api-key': apiKey
        }
    });
}

interface eventQRHashInput {
    event_id: string;
    secrect_code: string;
}

export async function getEventQRCode(input: eventQRHashInput): Promise<Response> {

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: 'auth token',
            'x-api-key': apiKey
        },
        body: JSON.stringify({ secret_code: input.secrect_code })
    };

    return fetch(`${host}/event/${input.event_id}/qr-codes`, options)
}

interface claimInput {
    address: string,
    secret_code: string,
    sendEmail: boolean,
    QRCode: string
}

export async function claimNFT(input: claimInput): Promise<Response> {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify({ sendEmail: input.sendEmail, qr_hash: input.QRCode, address: input.address, secret: input.secret_code })
    };

    return fetch(`${host}/actions/claim-qr`, options)
}

interface scanAddressInput {
    address: string
}

async function scanAddress(input: scanAddressInput): Promise<Response> {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-api-key': apiKey
        }
    };

    return fetch(`${host}/actions/scan/${input.address}`, options)
}

interface scanEventPOAPInput {
    event_id: string,
    limit: number,
    offset: number
}

async function scanEventPOAP(input: scanEventPOAPInput): Promise<Response> {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-api-key': apiKey
        }
    };

    return fetch(`${host}/event/${input.event_id}/poaps?limit=${input.limit}&offset=${input.offset}`, options)
}

interface scanAddressByEventInput {
    address: string,
    event_id: string
}

async function scanAddressByEvent(input: scanAddressByEventInput): Promise<Response> {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-api-key': apiKey
        }
    };

    return fetch(`${host}/actions/scan/${input.address}/${input.event_id}`, options)
}

function getImageName(url: string) {
    const lastIndex = url.lastIndexOf("/");
    return url.substring(lastIndex + 1);
}


async function url2base64(url: string) {
    const img = await fetch(url)
    const binary = await img.blob()
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(binary);
        reader.onloadend = () => {
            const base64data = reader.result as string;
            if (!base64data) {
                reject("unable to read")
                return
            }
            const filename = getImageName(url) || "image.png";
            const base64WithFilename = base64data.replace(/^data:(.*;base64,)?/, `data:image/png;name=${filename};base64,`);
            resolve(base64WithFilename);
        }
    });
}

export async function createEvent(): Promise<Response> {
    const input: CreateDropsInput = {
        name: 'Test2 ' + toPOAPdate(today),
        description: 'Description',
        city: 'Taipei',
        country: 'Taiwan',
        start_date: toPOAPdate(today),
        end_date: toPOAPdate(oneMonthFromToday),
        expiry_date: toPOAPdate(twoMonthsFromToday),
        event_url: 'https://poap.xyz/',
        virtual_event: true,
        secret_code: '123456',
        image: (await url2base64('https://i.imgur.com/g2aXdAP.png')) as string,
        filename: 'poap.png',
        contentType: 'image/png',
        event_template_id: 1,
        email: 'rodrigo@poap.io',
        requested_codes: 10,
        private_event: true,
    };

    return createDrop(input)
}

const main = async () => {

    const response = await createEvent()
    console.log(response.json())

    // const input: eventQRHashInput = {
    //     event_id: '123656',
    //     secrect_code: '123456'
    // }
    // const response = await getEventQRCode(input)

    // const input: claimInput = {
    //     address: '0x7777',
    //     secret_code: '123456',
    //     sendEmail: false,
    //     QRCode: ''
    // }
    // const response = await claimNFT(input)

    // const input: scanAddressInput = {
    //     address: '',
    // }
    // const response = await scanAddress(input)

    // const input: scanAddressByEventInput = {
    //     address: '',
    //     event_id: '123656'
    // }
    // const response = await scanAddressByEvent(input)

    // const input: scanEventPOAPInput = {
    //     event_id: '123656',
    //     limit: 10,
    //     offset: 0
    // }
    // const response = await scanEventPOAP(input)

    // return response.json()

}
main().then(data => {
    console.log(data)
}).catch(error => {
    console.error(error)
})
