// Чтобы создать миграцию пиши npx migrate create {любое название миграции}
// Импортируешь модельку в которой нужно создать миграцию
// Допустим, ты хочешь добавить/удалить какое-то поле из коллекции
// Чтобы добавить какое-то поле пиши: await Model.updateMany({}, {$set: {fieldName: value}})
// Чтобы убрать какое-то поле пиши: await Model.updateMany({}, {$unset: {fieldName: value}})
// Запускаешь миграцию npx migrate up {название миграции}
// Кстати, для миграций на всякий лучше будет использовать относительные пути (../models/*.model)
// Чтобы применить миграцию для нового поля - сначала нужно обновить основную схему и модель : )
// Почему это так важно? Потому что если бот будет уже в проде, то при помощи 1 команды можно будет запустить все миграции и сразу получить результат!
import { connectToDb } from "../common/functions/connectToDb";

export async function up (): Promise<void> {
  await connectToDb();
}

export async function down (): Promise<void> {
  await connectToDb();
}