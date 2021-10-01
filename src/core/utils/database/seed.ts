import CurrencyModel from "./schemas/currencySchema";
interface Currency {
  name: string;
  exchangeRate: number;
}

const currencyData: Currency[] = [
  {
    name: "USD",
    exchangeRate: 23000,
  },
  {
    name: "EUR",
    exchangeRate: 26640,
  },
  {
    name: "YEN",
    exchangeRate: 205,
  },
];

const seeding = async () => {
  try {
    const promise: any = currencyData.map(async (item) => {
      const data = new CurrencyModel(item);
      return await data.save();
    });
    await Promise.all(promise);
    console.log("Database seeded");
  } catch (error) {
    console.error("Cannot seed database");
  }
};

export default seeding;
