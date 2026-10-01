export interface Client {
  /** Stable internal identifier for the slot. While a client is unnamed this
   *  holds the "Client NN" placeholder and is never rendered to a user. */
  name: string;
  /** The client's actual name, once known. Optional: absent means the logo has
   *  no name we are cleared to publish, so its <img> is treated as decorative
   *  rather than labelled. Leaving it unset for a name you are still holding
   *  back is always safe — the logo still renders, it just goes unlabelled. */
  realName?: string;
  logo: string;
  width: number;
  height: number;
}

export const clients: Client[] = [
  { name: "Client 01", logo: "/Clients/1.png", width: 674, height: 553 },
  { name: "Client 02", logo: "/Clients/2.png", width: 861, height: 459 },
  { name: "Client 03", logo: "/Clients/3.png", width: 864, height: 501 },
  { name: "Client 04", logo: "/Clients/4.png", width: 929, height: 206 },
  { name: "Client 05", logo: "/Clients/5.png", width: 854, height: 764 },
  { name: "Client 06", logo: "/Clients/6.png", width: 858, height: 411 },
  { name: "Client 07", logo: "/Clients/7.png", width: 861, height: 332 },
  { name: "Client 09", logo: "/Clients/9.png", width: 864, height: 235 },
  { name: "Client 10", logo: "/Clients/10.png", width: 864, height: 250 },
  { name: "Client 11", logo: "/Clients/11.png", width: 851, height: 435 },
  { name: "Client 12", logo: "/Clients/12.png", width: 830, height: 830 },
  { name: "Client 13", logo: "/Clients/13.png", width: 749, height: 364 },
];
