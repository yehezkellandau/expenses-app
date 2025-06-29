import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExpenseSummary({ total, cash, credit }: { total: number; cash: number; credit: number }) {

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5">
            <Card className="shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-center text-lg text-gray-700">Total</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-center text-blue-600">{formatCurrency(total)}</p>
                </CardContent>
            </Card>

            <Card className="shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-center text-lg text-gray-700">Total Cash</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-center text-blue-600">{formatCurrency(cash)}</p>
                </CardContent>
            </Card>

            <Card className="shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-center text-lg text-gray-700">Total Credit</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-center text-blue-600">{formatCurrency(credit)}</p>
                </CardContent>
            </Card>
        </div>
    )
}
